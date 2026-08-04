export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  createdAt: string;
  isOwnMessage: boolean;
  type: 'text' | 'image' | 'location';
  text?: string;
  imageUrl?: string;
  location?: {
    label: string;
    address: string;
    latitude: number;
    longitude: number;
    mapPreviewUrl?: string;
  };
}

export interface ChatRoomDetail {
  id: string;
  name: string;
  memberCount: number;
  avatarUrl?: string;
  rulesText?: string;
  messages: ChatMessage[];
}
