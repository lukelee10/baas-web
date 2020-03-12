import { RequestStatusFlags } from '../app-global-constants';
import {
  VettingStatusPipe,
  VettingStatusShortenPipe
} from './vetting-status-shorten.pipe';

describe('VettingStatusShortenPipe', () => {
  it('create an instance of VettingStatusShortenPipe', () => {
    const pipe = new VettingStatusShortenPipe();
    expect(pipe).toBeTruthy();
  });

  it('Test Transformations of VettingStatusShortenPipe', () => {
    const pipe = new VettingStatusShortenPipe();
    expect(
      pipe.transform('PENDING') === RequestStatusFlags.Pending
    ).toBeTruthy();
    expect(pipe.transform('') === RequestStatusFlags.EmptyString).toBeTruthy();
    expect(pipe.transform('ERROR') === RequestStatusFlags.Error).toBeTruthy();
    expect(
      pipe.transform('INVESTIGATIVE LEAD') ===
        RequestStatusFlags.InvestigativeLead
    ).toBeTruthy();
    expect(
      pipe.transform('RED') === RequestStatusFlags.InvestigativeLead
    ).toBeTruthy();
    expect(pipe.transform('GREEN') === RequestStatusFlags.NoLead).toBeTruthy();
    expect(
      pipe.transform('NO LEAD') === RequestStatusFlags.NoLead
    ).toBeTruthy();

    expect(
      pipe.transform(undefined) === RequestStatusFlags.EmptyString
    ).toBeTruthy();

    expect(pipe.transform('DEFAULT') === 'DEF').toBeTruthy();

    expect(pipe).toBeTruthy();
  });

  // VettingStatusPipe
  it('create an instance of VettingStatusPipe', () => {
    const pipe = new VettingStatusPipe();
    expect(pipe).toBeTruthy();
  });

  it('Test Transformations of VettingStatusPipe', () => {
    const pipe = new VettingStatusPipe();
    expect(pipe.transform('RED') === 'INVESTIGATIVE LEAD').toBeTruthy();

    expect(pipe.transform('GREEN') === 'NO LEAD').toBeTruthy();

    expect(pipe.transform(undefined) === '').toBeTruthy();

    expect(pipe).toBeTruthy();
  });
});
