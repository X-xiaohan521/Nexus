package org.unimilk.backend.dto;

import java.util.List;

public record ConfigDto(
        Integer leaderboardRefreshRate,   // 单位：s（秒）
        String groundTruth,   // ground_truth 路径
        Boolean isLeaderboardEnabled,   // 排行榜是否开启
        List<String>availableGroundTruths,   // 可用的 ground_truth 路径
        Boolean allowRegistration,   // 是否允许新用户注册
        Integer defaultAllowSubmit   // 是否默认允许新用户提交
) {}
