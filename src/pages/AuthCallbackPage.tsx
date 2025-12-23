import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const finish = async () => {
      // If Supabase sent a ?code=..., exchange it for a session
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      if (code) {
        await supabase.auth.exchangeCodeForSession(window.location.href);
      }

      const { data } = await supabase.auth.getSession();

      if (data.session) {
        // Check for returnTo in state or query params
        const returnTo = location.state?.returnTo || url.searchParams.get("returnTo") || "/plan";
        navigate(returnTo, { replace: true });
      } else {
        navigate("/signin", { replace: true });
      }
    };

    finish();
  }, [navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Signing you in...</p>
    </div>
  );
}
