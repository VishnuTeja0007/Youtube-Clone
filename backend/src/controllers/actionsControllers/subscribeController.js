import userModel from "../../models/userModel.js";

async function toggleSubscibeController(req, res) {
    try {
        const { channelId } = req.body;
        const { id } = req.user; // Authenticated user's ID

        // 1. Check if the user is trying to subscribe to themselves
        if (id === channelId) {
            return res.status(400).json({ 
                message: "You cannot subscribe to your own channel." 
            });
        }

        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2. Check if the channel is already subscribed
        const isAlreadySubscribed = user.subscribedChannels.includes(channelId);

        let update;
        let statusMessage;

        if (isAlreadySubscribed) {
            update = { $pull: { subscribedChannels: channelId } };
            statusMessage = "Channel removed from Subscription";
        } else {
            update = { $addToSet: { subscribedChannels: channelId } };
            statusMessage = "Channel is subscribed";
        }

        // 3. Apply the update
        const updatedUser = await userModel.findByIdAndUpdate(
            id, 
            update, 
            { new: true }
        );

        res.status(200).json({ 
            message: statusMessage, 
            subscribed: !isAlreadySubscribed,
            user: updatedUser 
        });

    } catch (error) {
        console.error("Subscribe Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export default toggleSubscibeController;