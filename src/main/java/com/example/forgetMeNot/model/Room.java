package com.example.forgetMeNot.model;

import lombok.Data;
import java.util.List;

@Data
public class Room {

    private String id;
    private String name;
    private List<RoomItem> items;

    @Data
    public static class RoomItem {
        private String name;
        private boolean checked;
    }
}
