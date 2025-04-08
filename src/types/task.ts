export enum Sticker {
  ImportantASAP = "Important ASAP",
  OfflineMeeting = "Offline Meeting",
  VirtualMeeting = "Virtual Meeting",
  ASAP = "ASAP",
  ClientRelated = "Client Related",
  SelfTask = "Self Task",
  Appointments = "Appointments",
  CourtRelated = "Court Related",
}

export interface Task {
  id: number;
  category: string;
  title: string;
  dueDate: string;
  description: string;
  completed: boolean;
  stickers: Sticker[] | null;
}
