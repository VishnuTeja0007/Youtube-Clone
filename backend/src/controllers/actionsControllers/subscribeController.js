import userModel from "../../models/userModel";

async function toggleSubscibeController(req, res) {
    try {
        const { channelId } = req.body;
        const { id } = req.user; // Assuming id comes from auth middleware

        // 1. Fetch the user to check existing likes
        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2. Check if the channel is already subscribed
        // We use .some() for a boolean check (true/false)
        const isAlreadysubscribed = user.subscribedChannels.some(video => video.id === channelId);

        let update;
        let statusMessage;

        if (isAlreadysubscribed) {
            // Check version: If it exists, we REMOVE it (Toggle Off)
            update = { $pull: { subscribedChannels: { id: channelId } } };
            statusMessage = "Channel removed Subscription";
        } else {
            // Check version: If it doesn't exist, we ADD it (Toggle On)
            update = { $addToSet: { subscribedChannels: { id: channelId } } };
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
            subscribed: !isAlreadysubscribed,
            user: updatedUser 
        });

    } catch (error) {
        console.error("Like Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export default toggleSubscibeController;