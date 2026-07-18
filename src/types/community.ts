export interface CommunityRoom {
  id: string;
  name: string;
  memberCount?: number;
  onlineCount?: number;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  iconUrl?: string;
}

export interface PendingRequest {
  id: string;
  roomId: string;
  roomName: string;
  requestedAt: string;
}

export interface BrowseRoom {
  id: string;
  name: string;
  memberCount: number;
  status: 'available' | 'pending' | 'joined';
  requestedAt?: string;
  iconUrl?: string;
}
