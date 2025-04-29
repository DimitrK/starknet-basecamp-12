use contracts::Counter::{
    Counter, ICounterDispatcher, ICounterDispatcherTrait, ICounterSafeDispatcher,
    ICounterSafeDispatcherTrait,
};
use openzeppelin_access::ownable::interface::{IOwnableDispatcher, IOwnableDispatcherTrait};
use openzeppelin_utils::serde::SerializedAppend;
use snforge_std::EventSpyAssertionsTrait;
use snforge_std::{
    ContractClassTrait, DeclareResultTrait, declare, spy_events, start_cheat_caller_address,
    stop_cheat_caller_address,
};
// use starknet::contract_address::contract_address_const;
use starknet::{ContractAddress};

const ZERO: u32 = 0;
const OWNER: felt252 = 0x02dA5254690b46B9C4059C25366D1778839BE63C142d899F0306fd5c312A5918;


fn USER() -> ContractAddress {
    return 'USER'.try_into().unwrap();
}

fn __deploy__(name: ByteArray, init_value: u32) -> (ICounterDispatcher, IOwnableDispatcher) {
    // declare
    let contract_class = declare(name).unwrap().contract_class();
    //let contract_class = declare(name).expect('failed to declare').contract_class();

    // serialize contructor
    let mut calldata: Array<felt252> = array![];
    // let owner: ContractAddress = contract_address_const::<OWNER>();
    // owner.serialize(ref calldata);
    // init_value.serialize(ref calldata);
    calldata.append_serde(OWNER);
    calldata.append(init_value.into());

    let (contract_address, _) = contract_class.deploy(@calldata).expect('failed to deploy');

    let counter = ICounterDispatcher { contract_address };
    let ownable = IOwnableDispatcher { contract_address };

    return (counter, ownable);
}


#[test]
fn test_coutner_deployment() {
    let (counter, ownable) = __deploy__("Counter", ZERO);
    let count = counter.get_counter();
    let owner = ownable.owner();

    assert(count == ZERO, 'Should have initial value');
    assert(owner == OWNER.try_into().unwrap(), 'Should be the right owner');
}

#[test]
fn test_counter_increases() {
    let (counter, _) = __deploy__("Counter", ZERO);
    let initial_counter = counter.get_counter();
    counter.increase();
    assert(counter.get_counter() == initial_counter + 1, 'Should increase by one');
}

#[test]
fn test_increase_emitted_event() {
    let (counter, _) = __deploy__("Counter", ZERO);
    let mut spy = spy_events();
    start_cheat_caller_address(counter.contract_address, USER());
    counter.increase();
    stop_cheat_caller_address(counter.contract_address);
    spy
        .assert_emitted(
            @array![
                (
                    counter.contract_address,
                    Counter::Event::Increased(
                        Counter::Increased { setter: USER(), value: counter.get_counter() },
                    ),
                ),
            ],
        )
}

#[test]
#[feature("safe_dispatcher")]
fn test_safe_panic_decrease_counter() {
    let (counter, _) = __deploy__("Counter", ZERO);
    let safe_dispatcher = ICounterSafeDispatcher { contract_address: counter.contract_address };

    match safe_dispatcher.decrease() {
        Result::Ok(_) => panic!("cannot decrease 0"),
        Result::Err(e) => assert(*e[0] == 'Counter is zero', *e.at(0)),
    };
}
