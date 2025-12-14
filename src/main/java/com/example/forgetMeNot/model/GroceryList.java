package com.example.forgetMeNot.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroceryList {
    private String id;
    private String title;
    private List<GrocerySection> sections;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GrocerySection {
        private String name;
        private List<GroceryItem> items;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GroceryItem {
        private String name;
        private int quantity;
        private boolean checked;
    }
}
