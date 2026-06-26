import { useNavigate, useParams } from "react-router-dom";
import { Bell } from "lucide-react";
import { useNotificationAllRead } from "../hooks/useNotificationAllRead";
import { useNotificationUnreadCount } from "../hooks/useNotificationUnreadCount";

const NotificationBell = () => {
  const { workspaceSlug } = useParams();
  const navigate = useNavigate();
  const { mutate: markAllRead } = useNotificationAllRead(workspaceSlug!);
  const { data } = useNotificationUnreadCount(workspaceSlug!);
  const unreadCount = data?.count ?? 0;

  const handleClick = () => {
    if (unreadCount > 0) markAllRead();
    navigate(`/${workspaceSlug}/notifications`);
  };

  return (
    <button
      onClick={handleClick}
      className="relative flex h-9 w-9 items-center justify-center rounded-xl hover:bg-accent/50 transition-all duration-150"
    >
      <Bell size={18} strokeWidth={1.5} className="text-muted-foreground" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-700 px-1 text-[10px] font-semibold text-white ring-2 ring-background">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
