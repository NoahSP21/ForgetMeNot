package com.example.forgetMeNot.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subject {

    private String name;
    private Map<String, Unit> units;
}