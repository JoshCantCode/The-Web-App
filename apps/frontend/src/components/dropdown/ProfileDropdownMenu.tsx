"use client"
import { User, CreditCard, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage, Button, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@the-web-app/ui";
import { useSession, signOut } from "@/lib/auth-client";
import sendNotification from "@the-web-app/notifications";
import { NotificationType } from "@the-web-app/types";

interface ProfileDropdownProps {
    className?: string;
    align?: "start" | "center" | "end";
    side?: "top" | "right" | "bottom" | "left";
}

export function ProfileDropdown({
    className,
    align = "end",
    side = "bottom",
}: ProfileDropdownProps) {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    if (isPending) {
        return (
            <Avatar>
                <AvatarImage src="/placeholder.svg" alt="Loading..." />
                <AvatarFallback>
                    <div className="h-9 w-9 animate-pulse bg-gray-200" />
                </AvatarFallback>
            </Avatar>
        );
    }

    const user = session?.user;

    if(!user) {
        return null
    }

    const userName = user.name || "Loading..";
    const userImage = user.image || "/placeholder.svg";

    const userEmail = user.email || "Loading..";

    const handleLogout = async () => {
        await signOut({
            fetchOptions : {
                onRequest: () => {
                    console.log("Logging out...");
                    sendNotification({
                        type: NotificationType.Info,
                        message: "Logging out...",
                    })

                },
                onSuccess: () => {
                    console.log("Logged out successfully");
                    sendNotification({
                        type: NotificationType.Success,
                        message: "Logged out successfully",
                    })
                    router.push("/login");
                },
                onError: (ctx) => {
                    console.log("Error logging out");
                    sendNotification({
                        type: NotificationType.Error,
                        message: "Error logging out",
                    })
                    console.log(ctx);
                }
            }
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                variant="ghost"
                className={cn("h-10 w-10 rounded-full p-0", className)}
                >
                <Avatar className="h-9 w-9">
                    <AvatarImage src={userImage || "/placeholder.svg"} alt={userName} />
                    <AvatarFallback>
                    {userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align={align}
                side={side}
                className="w-56 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
                sideOffset={8}
            >
                <div className="flex items-center gap-2 p-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={userImage || "/placeholder.svg"} alt={userName} />
                    <AvatarFallback>
                    {userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-0.5 leading-none">
                    <p className="text-sm font-medium">{userName}</p>
                    <p className="text-xs text-muted-foreground">{userEmail}</p>
                </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                variant="destructive"
                onClick={handleLogout}
                >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
