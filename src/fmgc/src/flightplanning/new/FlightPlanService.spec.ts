// Copyright (c) 2021-2022 FlyByWire Simulations
// Copyright (c) 2021-2022 Synaptic Simulations
//
// SPDX-License-Identifier: GPL-3.0

import fetch from 'node-fetch';
import { FlightPlanService } from '@fmgc/flightplanning/new/FlightPlanService';

if (!globalThis.fetch) {
    globalThis.fetch = fetch;
}

describe('the flight plan service', () => {
    it('correctly accepts a city pair', async () => {
        await FlightPlanService.newCityPair('CYUL', 'LOWI', 'LOWG');

        expect(FlightPlanService.hasTemporary).toBeFalsy();

        expect(FlightPlanService.current.originAirport).toEqual(expect.objectContaining({ ident: 'CYUL' }));
        expect(FlightPlanService.current.destinationAirport).toEqual(expect.objectContaining({ ident: 'LOWI' }));
        expect(FlightPlanService.current.alternateDestinationAirport).toEqual(expect.objectContaining({ ident: 'LOWG' }));
    });

    it('deletes the temporary flight plan properly', async () => {
        await FlightPlanService.newCityPair('CYUL', 'LOWI', 'LOWG');

        await FlightPlanService.setOriginRunway('RW06R');

        FlightPlanService.temporaryDelete();

        expect(FlightPlanService.hasTemporary).toBeFalsy();
        expect(FlightPlanService.current.originRunway).toBeUndefined();
    });

    it('inserts the temporary flight plan properly', async () => {
        await FlightPlanService.newCityPair('CYUL', 'LOWI', 'LOWG');

        await FlightPlanService.setOriginRunway('RW06R');

        FlightPlanService.temporaryInsert();

        expect(FlightPlanService.hasTemporary).toBeFalsy();
        expect(FlightPlanService.current.originRunway).toEqual(expect.objectContaining({ ident: 'RW06R' }));
    });

    it('creates a temporary flight plan after setting an origin runway', async () => {
        await FlightPlanService.newCityPair('CYUL', 'LOWI', 'LOWG');

        await FlightPlanService.setOriginRunway('RW06R');

        expect(FlightPlanService.hasTemporary).toBeTruthy();
        expect(FlightPlanService.current.originRunway).not.toBeUndefined();
    });

    it('creates a temporary flight plan after setting a departure procedure', async () => {
        await FlightPlanService.newCityPair('CYUL', 'LOWI', 'LOWG');

        await FlightPlanService.setOriginRunway('RW06R');

        FlightPlanService.temporaryInsert();
        expect(FlightPlanService.hasTemporary).toBeFalsy();

        await FlightPlanService.setDepartureProcedure('CYUL1');

        expect(FlightPlanService.hasTemporary).toBeTruthy();
        expect(FlightPlanService.current.originRunway).not.toBeUndefined();
    });

    it('creates a temporary flight plan after setting a departure enroute transition', async () => {
        await FlightPlanService.newCityPair('CYYZ', 'LOWI', 'LOWG');

        await FlightPlanService.setOriginRunway('RW06R');
        await FlightPlanService.setDepartureProcedure('AVSEP6');

        FlightPlanService.temporaryInsert();
        expect(FlightPlanService.hasTemporary).toBeFalsy();

        await FlightPlanService.setDepartureEnrouteTransition('OTNIK');

        expect(FlightPlanService.hasTemporary).toBeTruthy();
        expect(FlightPlanService.current.originRunway).not.toBeUndefined();
    });

    it('creates a temporary flight plan after setting a destination runway', async () => {
        await FlightPlanService.newCityPair('CYYZ', 'LOWI', 'LOWG');

        await FlightPlanService.setOriginRunway('RW06R');
        await FlightPlanService.setDepartureProcedure('AVSEP6');
        await FlightPlanService.setDepartureEnrouteTransition('OTNIK');

        FlightPlanService.temporaryInsert();
        expect(FlightPlanService.hasTemporary).toBeFalsy();

        await FlightPlanService.setDestinationRunway('RW08');

        expect(FlightPlanService.hasTemporary).toBeTruthy();
        expect(FlightPlanService.current.originRunway).not.toBeUndefined();
    });

    it('creates a temporary flight plan after setting an arrival procedure', async () => {
        await FlightPlanService.newCityPair('CYYZ', 'LOWI', 'LOWG');

        await FlightPlanService.setOriginRunway('RW06R');
        await FlightPlanService.setDepartureProcedure('AVSEP6');
        await FlightPlanService.setDepartureEnrouteTransition('OTNIK');
        await FlightPlanService.setDestinationRunway('RW08');

        FlightPlanService.temporaryInsert();
        expect(FlightPlanService.hasTemporary).toBeFalsy();

        await FlightPlanService.setArrival('BREN4B');

        expect(FlightPlanService.hasTemporary).toBeTruthy();
        expect(FlightPlanService.current.originRunway).not.toBeUndefined();
    });

    it('creates a temporary flight plan after setting an arrival enroute transition', async () => {
        await FlightPlanService.newCityPair('CYYZ', 'KJFK', 'KEWR');

        await FlightPlanService.setOriginRunway('RW06R');
        await FlightPlanService.setDepartureProcedure('AVSEP6');
        await FlightPlanService.setDepartureEnrouteTransition('OTNIK');
        await FlightPlanService.setDestinationRunway('RW04L');
        await FlightPlanService.setArrival('PARCH3');

        FlightPlanService.temporaryInsert();
        expect(FlightPlanService.hasTemporary).toBeFalsy();

        await FlightPlanService.setArrivalEnrouteTransition('PLYMM');

        expect(FlightPlanService.hasTemporary).toBeTruthy();
        expect(FlightPlanService.current.originRunway).not.toBeUndefined();
    });

    it('creates a temporary flight plan after setting an approach procedure', async () => {
        await FlightPlanService.newCityPair('CYYZ', 'LOWI', 'LOWG');

        await FlightPlanService.setOriginRunway('RW06R');
        await FlightPlanService.setDepartureProcedure('AVSEP6');
        await FlightPlanService.setDepartureEnrouteTransition('OTNIK');
        await FlightPlanService.setDestinationRunway('RW08');
        await FlightPlanService.setArrival('BREN4B');

        FlightPlanService.temporaryInsert();
        expect(FlightPlanService.hasTemporary).toBeFalsy();

        await FlightPlanService.setApproach('R08-Y');

        expect(FlightPlanService.hasTemporary).toBeTruthy();
        expect(FlightPlanService.current.originRunway).not.toBeUndefined();
    });

    it('creates a temporary flight plan after setting an approach via', async () => {
        await FlightPlanService.newCityPair('CYYZ', 'LGKR', 'LGKO');

        await FlightPlanService.setOriginRunway('RW06R');
        await FlightPlanService.setDepartureProcedure('AVSEP6');
        await FlightPlanService.setDepartureEnrouteTransition('OTNIK');
        await FlightPlanService.setDestinationRunway('RW34');
        await FlightPlanService.setArrival('PARA1J');
        await FlightPlanService.setApproach('R34');

        FlightPlanService.temporaryInsert();
        expect(FlightPlanService.hasTemporary).toBeFalsy();

        await FlightPlanService.setApproachVia('BEDEX');

        expect(FlightPlanService.hasTemporary).toBeTruthy();
        expect(FlightPlanService.current.originRunway).not.toBeUndefined();
    });
});
