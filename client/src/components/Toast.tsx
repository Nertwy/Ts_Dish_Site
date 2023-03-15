import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeNotification } from '../app/notifications';

const Notification: FC<any> = ({ notification }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const timeout = setTimeout(() => {
            dispatch(removeNotification(notification.id));
        }, 5000);
        return () => clearTimeout(timeout);
    }, [notification, dispatch]);

    return (
        <div className={`bg-${notification.type}-500 text-white py-2 px-4 rounded-md mb-2`}>
            {notification.message}
        </div>
    );
};

// export default Notification;
// const NotificationList = () => {
//     const notifications = useSelector((state) => state.notifications);

//     return (
//         <div className="fixed bottom-0 right-0 p-4">
//             {notifications.map((notification) => (
//                 <Notification key={notification.id} notification={notification} />
//             ))}
//         </div>
//     );
// };

// export default NotificationList;