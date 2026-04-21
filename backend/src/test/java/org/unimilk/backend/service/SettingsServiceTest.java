package org.unimilk.backend.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class SettingsServiceTest {
    private final SettingsService settingsService;

    @Autowired
    SettingsServiceTest(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @Test
    void testGetAvailableGroundTruths() {
        assertEquals(new ArrayList<>(Arrays.asList("A_test", "B_test")), settingsService.getAvailableGroundTruths());
    }
}