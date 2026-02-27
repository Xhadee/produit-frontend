import { TestBed } from '@angular/core/testing';

import { IaAnalysisService } from './ia-analysis.service';

describe('IaAnalysisService', () => {
  let service: IaAnalysisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IaAnalysisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
