import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { getCurrentUser } from "@/lib/auth";

export const Route = createFileRoute("/_admin/")({
  component: IndexRedirect,
});

function IndexRedirect() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    if (!user) return;
    if (user.role === "producer") {
      navigate({ to: "/music" });
    } else {
      navigate({ to: "/orders" });
    }
  }, [navigate, user]);

  return null;
}
