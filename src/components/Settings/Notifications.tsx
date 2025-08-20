import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

interface NotificationSettings {
    productUpdates: boolean
    comments: boolean
    checkoutProduct: boolean
}

const Notifications = () => {
    const [notifications, setNotifications] = useState<NotificationSettings>({
        productUpdates: true,
        comments: false,
        checkoutProduct: true,
    })

    const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
        setNotifications((prev) => ({ ...prev, [key]: value }))
    }

    const handleSave = () => {
        // Handle save functionality
        console.log("Saving notification settings:", notifications)
    }

    return (
        <div className=" p-6 rounded-lg">
            <div className="flex items-center gap-2 border-b  pb-6 mb-6">
                <h1 className="text-lg font-medium text-[#30373D]">Notification</h1>
                <Tooltip>
                    <TooltipTrigger>
                        <Info className="h-4 w-4 " />
                    </TooltipTrigger>
                    <TooltipContent className=" text-white">
                        <p>Manage your notification preferences</p>
                    </TooltipContent>
                </Tooltip>
            </div>

            <Card className='p-0 border-[#54BB52]/20 bg-white'>
                <CardContent className="space-y-7">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                        <div className="flex items-start gap-2">
                            <Label htmlFor="product-updates" className="text-sm font-medium text-[#30373D]">
                                Product updates
                            </Label>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="h-4 w-4 " />
                                </TooltipTrigger>
                                <TooltipContent className=" text-white">
                                    <p>Get notified about new product features</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <Switch
                            id="product-updates"
                            checked={notifications.productUpdates}
                            onCheckedChange={(checked) => handleNotificationChange("productUpdates", checked)}
                            className="data-[state=checked]:bg-[#54BB52]"
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 ">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="comments" className="text-sm font-medium text-[#30373D]">
                                Comments
                            </Label>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="h-4 w-4 " />
                                </TooltipTrigger>
                                <TooltipContent className=" text-white">
                                    <p>Get notified about new comments</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <Switch
                            id="comments"
                            checked={notifications.comments}
                            onCheckedChange={(checked) => handleNotificationChange("comments", checked)}
                            className="data-[state=checked]:bg-[#54BB52]"
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 ">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="checkout-product" className="text-sm font-medium text-[#30373D]">
                                Checkout Product
                            </Label>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="h-4 w-4 " />
                                </TooltipTrigger>
                                <TooltipContent className=" text-white">
                                    <p>Get notified about checkout updates</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <Switch
                            id="checkout-product"
                            checked={notifications.checkoutProduct}
                            onCheckedChange={(checked) => handleNotificationChange("checkoutProduct", checked)}
                            className="data-[state=checked]:bg-[#54BB52]"
                        />
                    </div>
                </CardContent>
            </Card>

            <Button onClick={handleSave} className="bg-[#54BB52] hover:bg-[#358f34] text-white px-8 mt-6">
                Save
            </Button>
        </div>
    );
};

export default Notifications;