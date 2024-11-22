import {type GeneratedType, Registry } from "@cosmjs/proto-signing";

import {
    cosmosProtoRegistry,
    cosmwasmProtoRegistry,
    ibcProtoRegistry,
    osmosisProtoRegistry,
} from 'osmojs';

const protoRegistry: ReadonlyArray<[string, GeneratedType]> = [
    ...cosmosProtoRegistry,
    ...cosmwasmProtoRegistry,
    ...ibcProtoRegistry,
    ...osmosisProtoRegistry
];

export const registry = new Registry(protoRegistry);