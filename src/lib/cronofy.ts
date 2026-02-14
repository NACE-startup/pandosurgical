// Cronofy API Integration
// Get your credentials at https://app.cronofy.com

const CRONOFY_CLIENT_ID = import.meta.env.VITE_CRONOFY_CLIENT_ID;
const CRONOFY_DATA_CENTER = import.meta.env.VITE_CRONOFY_DATA_CENTER || 'us';

// Cronofy Elements CDN - for embedding UI components
export const CRONOFY_ELEMENTS_URL = 'https://elements.cronofy.com/js/CronofyElements.v1.58.0.js';

// Generate authorization URL for connecting calendars
export const getCronofyAuthUrl = (redirectUri: string, state?: string) => {
  const baseUrl = CRONOFY_DATA_CENTER === 'us' 
    ? 'https://app.cronofy.com/oauth/authorize'
    : `https://app-${CRONOFY_DATA_CENTER}.cronofy.com/oauth/authorize`;
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CRONOFY_CLIENT_ID || '',
    redirect_uri: redirectUri,
    scope: 'read_events create_event delete_event read_free_busy',
    state: state || '',
  });
  
  return `${baseUrl}?${params.toString()}`;
};

// Cronofy Elements configuration types
export interface CronofyElementsConfig {
  element_token: string;
  target_id: string;
  data_center?: string;
  styles?: {
    prefix?: string;
  };
}

export interface CalendarSyncConfig extends CronofyElementsConfig {
  authorization: {
    redirect_uri: string;
    scope: string;
  };
}

export interface AvailabilityViewerConfig extends CronofyElementsConfig {
  availability_query: {
    participants: Array<{
      required: 'all' | 'any';
      members: Array<{ sub: string }>;
    }>;
    required_duration: { minutes: number };
    available_periods: Array<{
      start: string;
      end: string;
    }>;
  };
}

export interface DateTimePickerConfig extends CronofyElementsConfig {
  mode: 'confirm' | 'no_confirm';
  callback: (notification: { notification: { type: string; slot?: { start: string; end: string } } }) => void;
  availability_query: {
    participants: Array<{
      required: 'all' | 'any';
      members: Array<{ sub: string }>;
    }>;
    required_duration: { minutes: number };
    query_periods: Array<{
      start: string;
      end: string;
    }>;
  };
  styles?: {
    prefix?: string;
  };
}

// Load Cronofy Elements script dynamically
export const loadCronofyElements = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ((window as any).CronofyElements) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = CRONOFY_ELEMENTS_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Cronofy Elements'));
    document.head.appendChild(script);
  });
};

// Initialize Cronofy Calendar Sync element
export const initCalendarSync = (config: CalendarSyncConfig) => {
  const CronofyElements = (window as any).CronofyElements;
  if (!CronofyElements) {
    console.error('Cronofy Elements not loaded');
    return;
  }

  CronofyElements.CalendarSync({
    ...config,
    data_center: CRONOFY_DATA_CENTER,
  });
};

// Initialize Cronofy Availability Viewer
export const initAvailabilityViewer = (config: AvailabilityViewerConfig) => {
  const CronofyElements = (window as any).CronofyElements;
  if (!CronofyElements) {
    console.error('Cronofy Elements not loaded');
    return;
  }

  CronofyElements.AvailabilityViewer({
    ...config,
    data_center: CRONOFY_DATA_CENTER,
  });
};

// Initialize Cronofy Date Time Picker
export const initDateTimePicker = (config: DateTimePickerConfig) => {
  const CronofyElements = (window as any).CronofyElements;
  if (!CronofyElements) {
    console.error('Cronofy Elements not loaded');
    return;
  }

  CronofyElements.DateTimePicker({
    ...config,
    data_center: CRONOFY_DATA_CENTER,
  });
};

// Initialize Cronofy Agenda
export const initAgenda = (config: CronofyElementsConfig & { 
  localization?: { locale?: string };
}) => {
  const CronofyElements = (window as any).CronofyElements;
  if (!CronofyElements) {
    console.error('Cronofy Elements not loaded');
    return;
  }

  CronofyElements.Agenda({
    ...config,
    data_center: CRONOFY_DATA_CENTER,
  });
};

// Initialize Slot Picker for scheduling
export const initSlotPicker = (config: CronofyElementsConfig & {
  callback: (notification: any) => void;
  slots: Array<{
    start: string;
    end: string;
  }>;
  tzid?: string;
}) => {
  const CronofyElements = (window as any).CronofyElements;
  if (!CronofyElements) {
    console.error('Cronofy Elements not loaded');
    return;
  }

  CronofyElements.SlotPicker({
    ...config,
    data_center: CRONOFY_DATA_CENTER,
  });
};

export const isCronofyConfigured = () => {
  return !!CRONOFY_CLIENT_ID;
};

