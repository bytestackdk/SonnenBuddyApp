import { HttpErrorResponse } from '@angular/common/http';

export class LoadingState {
  error: string | HttpErrorResponse;
  loaded: boolean;
  loading: boolean;
  failed: boolean;

  static initial(): LoadingState {
    return {
      error: null,
      loaded: false,
      loading: false,
      failed: false,
    };
  }

  static loading(): LoadingState {
    return {
      error: null,
      loaded: false,
      loading: true,
      failed: false,
    };
  }

  static loaded(): LoadingState {
    return {
      error: null,
      loaded: true,
      loading: false,
      failed: false,
    };
  }

  static failed(error: string | HttpErrorResponse = null): LoadingState {
    return {
      error,
      loaded: false,
      loading: false,
      failed: true,
    };
  }
}
