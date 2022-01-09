// Copyright (c) 2021-2022 FlyByWire Simulations
// Copyright (c) 2021-2022 Synaptic Simulations
//
// SPDX-License-Identifier: GPL-3.0

import { FlightPlan } from '@fmgc/flightplanning/new/plans/FlightPlan';
import { FlightPlanDefinition } from '@fmgc/flightplanning/new/FlightPlanDefinition';

export enum FlightPlanIndex {
    Active,
    Temporary,
    FirstSecondary,
}

export class FlightPlanManager {
    private plans: FlightPlan[] = [
        FlightPlan.empty(),
    ]

    has(index: number) {
        return this.plans[index] !== undefined;
    }

    get(index: number) {
        this.assertFlightPlanExists(index);

        return this.plans[index];
    }

    private set(index: number, flightPlan: FlightPlan) {
        this.plans[index] = flightPlan;
    }

    create(index: number, definition?: FlightPlanDefinition) {
        this.assertFlightPlanDoesntExist(index);

        const flightPlan = definition ? FlightPlan.fromDefinition(definition) : FlightPlan.empty();

        this.plans[index] = flightPlan;
    }

    delete(index: number) {
        this.assertFlightPlanExists(index);

        this.plans[index] = undefined;
    }

    swap(a: number, b: number) {
        this.assertFlightPlanExists(a);
        this.assertFlightPlanExists(b);
    }

    copy(from: number, to: number) {
        this.assertFlightPlanExists(from);

        const newPlan = this.get(from).clone();

        this.set(to, newPlan);
    }

    private assertFlightPlanExists(index: number) {
        if (!this.plans[index]) {
            throw new Error(`[FMS/FlightPlanManager] Tried to access non-existent flight plan at index #${index}`);
        }
    }

    private assertFlightPlanDoesntExist(index: number) {
        if (this.plans[index]) {
            throw new Error(`[FMS/FlightPlanManager] Tried to create existent flight plan at index #${index}`);
        }
    }
}
