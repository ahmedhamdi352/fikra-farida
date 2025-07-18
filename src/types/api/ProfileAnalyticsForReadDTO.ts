export type ProfileAnalyticsForReadDTO = {
  TotalViews: number;
  TotalClicks: number;
  Rate: number;
  Links: link[];
};

type link = {
  Title: string;
  Type: number;
  Url: string;
  Clicks: number;
};
