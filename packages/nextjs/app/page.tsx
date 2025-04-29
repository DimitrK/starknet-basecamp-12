"use client";

import { ConnectedAddress } from "~~/components/ConnectedAddress";
import {
  useCounterActions,
  useCounterValue,
} from "~~/hooks/useCounterContract";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-stark/useScaffoldEventHistory";
import { useBlockNumber } from "@starknet-react/core";
import { BlockTag } from "starknet";
import { useEffect, useState } from "react";

const Home = () => {
  const actions = useCounterActions();
  const counterValue = useCounterValue();
  const [events, setEvents] = useState<any[]>([]);

  const { data: latestBlock } = useBlockNumber({
    blockIdentifier: BlockTag.LATEST,
  });
  const fromBlock =
    latestBlock && latestBlock > 50 ? BigInt(latestBlock - 50) : 0n;
  const { data: increaseEvents } = useScaffoldEventHistory({
    watch: true,
    contractName: "Counter",
    eventName: "contracts::Counter::Counter::Increased",
    fromBlock,
  });

  const { data: decreaseEvents } = useScaffoldEventHistory({
    watch: true,
    contractName: "Counter",
    eventName: "contracts::Counter::Counter::Decreased",
    fromBlock,
  });

  useEffect(() => {
    const parsedIncreaseEvents = increaseEvents?.map((event) => {
      if (!event?.parsedArgs) {
        return;
      }
      return {
        timestamp: event.block.timestamp,
        value: event.parsedArgs?.value,
        setter: event.parsedArgs?.setter?.toString?.(),
        type: "increase",
      };
    });

    const parsedDecreaseEvents = decreaseEvents?.map((event) => {
      if (!event?.parsedArgs) {
        return;
      }
      return {
        timestamp: event.block.timestamp,
        value: event.parsedArgs?.value,
        setter: event.parsedArgs?.setter?.toString?.(),
        type: "decrease",
      };
    });

    setEvents(
      [...parsedIncreaseEvents, ...parsedDecreaseEvents].sort((a, b) => {
        if (a?.timestamp < b?.timestamp) {
          return 1;
        }
        if (a?.timestamp > b?.timestamp) {
          return -1;
        }
        return 0;
      }),
    );
  }, [increaseEvents, decreaseEvents]);

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5 w-full max-w-6xl">
        <h1 className="text-center">
          <span className="block text-4xl font-bold">Counter demo</span>
        </h1>
        <ConnectedAddress />
      </div>

      <div className="bg-container flex-grow w-full mt-16 px-8 py-12">
        <div className="flex justify-center items-center sm:items-start gap-12 flex-col sm:flex-row">
          <div className="p-4 bg-base-200 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Current Count</h3>
            <p className="text-5xl font-bold text-center my-4">
              {isFinite(counterValue) ? counterValue.toString() : "-"}
            </p>

            <div className="flex justify-center gap-4 mt-4">
              <button
                disabled={actions.isLoading}
                className="btn btn-primary btn-lg"
                onClick={actions.increase}
              >
                Increment
              </button>
              <button
                disabled={actions.isLoading}
                className="btn btn-outline btn-lg"
                onClick={actions.decrease}
              >
                Decrease
              </button>
            </div>
          </div>
          <div className="bg-base-100 p-8 rounded-3xl border border-gradient shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-secondary">
              Activity History
            </h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {events && events.length > 0 ? (
                events.map((event, index) => {
                  const setterContractAddress = event.setter;
                  const setterValue = event.value.toString();
                  const type = event.type;
                  return (
                    <div
                      key={`${setterContractAddress}-${setterValue}-${index}`}
                      className="p-4 bg-base-200 rounded-xl"
                    >
                      <p className="text-lg">
                        <span className="font-medium">
                          <span
                            className={`pr-1 ${type === "increase" ? "text-[#32BAC4]" : "text-error"}`}
                          >{`${type === "increase" ? "⇧" : "⇩"}`}</span>
                          <span>{`${setterContractAddress.slice(0, 5)}∵${setterContractAddress.slice(61)} set the counter to ${setterValue}`}</span>
                        </span>
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-lg opacity-70">
                  No activity yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
