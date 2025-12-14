package com.example.forgetMeNot.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {
    private String id;
    private String title;
    private String section;
    private String date;      // "DD/MM/YYYY"
    private String time;      // "HH:MM AM/PM"
    private boolean confirmed;
    private long createdAt;
}
