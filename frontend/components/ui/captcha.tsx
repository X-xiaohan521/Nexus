'use client';

import { apiFetch } from '@/lib/api';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

declare global {
  interface Window {
    initGeetest4: any;
  }
}

export type CaptchaResult = {
  lot_number: string;
  captcha_output: string;
  pass_token: string;
  gen_time: string;
};

interface Props {
  onSuccess: (result: CaptchaResult) => void;
}

export default function GeetestCaptcha({ onSuccess }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const captchaRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);

  // 1. 动态加载脚本
  useEffect(() => {
    const script = document.createElement('script');
    
    script.src = '/geetest/gt4.js';

    script.onerror = () => {
      const cdnScript = document.createElement('script');
      cdnScript.src = 'https://static.geetest.com/v4/gt4.js';
      cdnScript.onload = () => setLoaded(true);
      document.body.appendChild(cdnScript);
    };
    script.async = true;

    script.onload = () => {
      setLoaded(true);
    };

    document.body.appendChild(script);
  }, []);

  // 2. 初始化验证码
  useEffect(() => {
    if (!loaded) return;

    async function init() {
      const response = await apiFetch('/api/auth/captcha/init', {}, true);

      if (response.code !== 1) {
        console.log("无法加载验证码，请检查网络。")
        return
      }

      const data = response.data as any

      window.initGeetest4(
        {
          captchaId: data.captchaId,
          product: 'popup',
        },
        function (captchaObj: any) {
          captchaObj.appendTo(containerRef.current);

          captchaObj.onSuccess(() => {
            const result = captchaObj.getValidate();
            if (result) {
              onSuccess(result);
            }
          });

          captchaRef.current = captchaObj;
        }
      );
    }

    init();
  }, [loaded]);

  return <div ref={containerRef} />;
}