import type { User } from "firebase/auth"
import type { Timestamp } from "firebase/firestore"

export type Doc = {
  name: string,
  id?: string,
  image: string,
  color: string,
  createdAt: Timestamp,
  user: {
    uid: User["uid"],
    photoURL: User["photoURL"],
    displayName: User["displayName"],
    username: string
  }
}

export type UserDoc = {
  uid: User["uid"],
  email: User["email"],
  isOnline: boolean,
  photoURL: User["photoURL"],
  displayName: User["displayName"],
  username: string
}

export type PinCategory = {
  name: string,
  id: string,
}

enum PinCategoryEnum {
  "food",
  "drink",
  "toy",
  "clothes",
  "other"
}