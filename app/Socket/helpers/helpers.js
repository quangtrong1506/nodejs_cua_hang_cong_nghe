export const handleUserMessage = ({
    socketIOServer,
    socket,
    message,
    userId,
}) => {
    if (
        message.text.toLowerCase() === 'start' ||
        message.text.toLowerCase() === 'bắt đầu'
    )
        socketIOServer
            .of('/chat')
            .to(socket.id)
            .emit('get_chat', {
                message: {
                    text: `Bạn cần giúp đỡ gì?<br/>
                    <mark>DONHANG_Mã đơn hàng</mark> để xem đơn hàng của mình (VD: DONHANG_001)
                    <br/>
                    <mark>SANPHAM_Tên sản phẩm</mark> để tìm kiếm nhanh sản phẩm  (VD: SANPHAM_IPhone 12)
                    `,
                },
            });
};
