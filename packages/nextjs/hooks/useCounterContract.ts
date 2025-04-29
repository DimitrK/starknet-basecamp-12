"use client";

import { useContext } from "react";
import { Contract } from "starknet";
import {
  CounterGetterContext,
  CounterContractContext,
  CounterActionsContext,
  CounterContextNotProvided,
  type CounterActions,
} from "~~/components/CounterProvider";

export const useCounterValue = (): number => {
  const counter = useContext(CounterGetterContext);
  if (counter === CounterContextNotProvided) {
    throw new Error(
      "useCounterValue must be used within a CounterContractProvider",
    );
  }

  return counter;
};

export const useCounterActions = (): CounterActions => {
  const actions = useContext(CounterActionsContext);
  if (actions === CounterContextNotProvided) {
    throw new Error(
      "useCounterActions must be used within a CounterContractProvider",
    );
  }

  return actions;
};

export const useCounterContractInfo = (): Contract | undefined => {
  const contract = useContext(CounterContractContext);
  if (contract === CounterContextNotProvided) {
    throw new Error(
      "useCounterContractInfo must be used within a CounterContractProvider",
    );
  }

  return contract;
};
