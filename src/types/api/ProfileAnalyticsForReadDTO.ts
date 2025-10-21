export type ProfileAnalyticsForReadDTO = {
  TotalViews: number;
  TotalClicks: number;
  Rate: number;
  Links: link[];
  TotalClickedEmailClicks: number;
TotalClickedPhoneClicks: number;
TotalClickedWebsiteClicks: number;
TotalSavedContactClicks: number;
};

type link = {
  Title: string;
  Type: number;
  Url: string;
  Clicks: number;
};
