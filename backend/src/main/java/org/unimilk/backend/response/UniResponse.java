package org.unimilk.backend.response;

import lombok.Data;

@Data
public class UniResponse {
    private Integer code;
    private String msg;
    private Object data;

    private UniResponse() {}

    public static UniResponse success() {
        UniResponse uniResp = new UniResponse();
        uniResp.code = 1;
        uniResp.msg = "";
        return uniResp;
    }

    public static UniResponse success(Object data) {
        UniResponse uniResp = new UniResponse();
        uniResp.code = 1;
        uniResp.data = data;
        uniResp.msg = "";
        return uniResp;
    }

    public static UniResponse success(Object data, String msg) {
        UniResponse uniResp = new UniResponse();
        uniResp.code = 1;
        uniResp.data = data;
        uniResp.msg = msg;
        return uniResp;
    }

    public static UniResponse error(String msg) {
        UniResponse uniResp = new UniResponse();
        uniResp.code = 0;
        uniResp.msg = msg;
        return uniResp;
    }
}
