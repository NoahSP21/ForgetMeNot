export interface RoomItem {
    name: string;
    checked: boolean;
}

export interface Room {
    id?: string;
    name: string;
    items: RoomItem[];
}
