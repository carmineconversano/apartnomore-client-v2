import {TestBed} from '@angular/core/testing';

import {NoticesBoardsService} from './notices-boards.service';

describe('NoticesBoardsService', () => {
  let service: NoticesBoardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoticesBoardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
