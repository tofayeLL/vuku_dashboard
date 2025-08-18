export interface ChatUser {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread?: boolean
}
export interface Message {
  id: string
  userId: string
  userName: string
  avatar: string
  content: string
  timestamp: string
  reactions?: string[]
}

type AllTypes = {
  reportName?: string,
  createdAt?: string | number | Date,
  user: {
    fullName?: string
  },
  fullName?: string,
  profileImage?: string,
  role?: string,
  status?: string,
  User_Name?: string,
  User_Email?: string,
  Email?: string,
  Film_Name?: string,
  Amount?: string,
  Date?: string,
  End_Date?: string,
  Status?: string,
  Destination?: string,
  Trips?: number,
  Transaction_Date?: string,
  Transaction_ID?: string,
  Payment_Method?: string,
  Amount_Paid?: string,

  // report list Table
  Report_Name?: string,
  Created_by?: string,
  Created_Date?: string,

  // warden Management
  User_Role?: string
  Name?: string,
  Last_Active?: string,

  //  report table
  Location?: string,
  Catches?: number,
  Image?: string,
  id?: string,
  singleData?:string
};

export type allTypes = AllTypes[];