"use client";

import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import { useScaffoldContract } from "~~/hooks/scaffold-stark/useScaffoldContract";
import { Contract } from "starknet";

export type CounterActions = {
  increase: () => void;
  decrease: () => void;
  isLoading: boolean;
};

export const CounterContextNotProvided = Symbol("CounterContextNotProvided");
export const CounterGetterContext = createContext<
  number | typeof CounterContextNotProvided
>(CounterContextNotProvided);
export const CounterActionsContext = createContext<
  CounterActions | typeof CounterContextNotProvided
>(CounterContextNotProvided);
export const CounterContractContext = createContext<
  Contract | undefined | typeof CounterContextNotProvided
>(CounterContextNotProvided);

export const CounterContractProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { data: counterValue } = useScaffoldReadContract({
    contractName: "Counter",
    functionName: "get_counter",
  });
  const { sendAsync: decrease } = useScaffoldWriteContract({
    contractName: "Counter",
    functionName: "decrease",
  });
  const { sendAsync: increase } = useScaffoldWriteContract({
    contractName: "Counter",
    functionName: "increase",
  });
  const { data: counter, isLoading } = useScaffoldContract({
    contractName: "Counter",
  });
  const [loading, setLoading] = useState(isLoading);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const increaseAction = useCallback(async () => {
    if (isLoading) {
      return;
    }
    setLoading(true);
    increase().finally(() => {
      setLoading(false);
    });
  }, [increase, isLoading]);

  const decreaseAction = useCallback(async () => {
    if (isLoading) {
      return;
    }
    setLoading(true);
    decrease().finally(() => {
      setLoading(false);
    });
  }, [decrease, isLoading]);

  const counterActions = {
    increase: increaseAction,
    decrease: decreaseAction,
    isLoading: loading,
  };

  return (
    <CounterGetterContext.Provider
      value={typeof counterValue === "bigint" ? Number(counterValue) : Infinity}
    >
      <CounterContractContext.Provider value={isLoading ? undefined : counter}>
        <CounterActionsContext.Provider value={counterActions}>
          {children}
        </CounterActionsContext.Provider>
      </CounterContractContext.Provider>
    </CounterGetterContext.Provider>
  );
};
