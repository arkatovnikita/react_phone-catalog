export interface Toast {
  id: number;
  message: string;
  link?: {
    label: string;
    to: string;
  };
}
