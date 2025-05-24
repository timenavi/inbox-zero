"use client";

import { useEffect, useState } from "react";
import { useIntercom } from "react-use-intercom";
import { usePathname } from "next/navigation";
import { env } from "@/env";

const IntercomChat = ({ email }: { email?: string }) => {
  const pathname = usePathname();
  const { boot, shutdown, hide, show, update } = useIntercom();

  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    if (!env.NEXT_PUBLIC_INTERCOM_APP_ID) return;

    boot({
      appId: env.NEXT_PUBLIC_INTERCOM_APP_ID,
      hide_default_launcher: false,
    });
    setIsConfigured(true);

    return () => {
      shutdown();
    };
  }, [boot, shutdown]);

  useEffect(() => {
    if (!env.NEXT_PUBLIC_INTERCOM_APP_ID || !isConfigured) return;

    if (email) {
      update({ email });
    }
  }, [email, isConfigured, update]);

  useEffect(() => {
    if (!env.NEXT_PUBLIC_INTERCOM_APP_ID || !isConfigured) return;

    if (pathname.includes("/automation") || pathname.includes("/reply-zero")) {
      hide();
    } else {
      show();
    }
  }, [pathname, isConfigured, hide, show]);

  return null;
};

export default IntercomChat;
