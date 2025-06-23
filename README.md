
```
server
├─ common
│  ├─ errors
│  │  ├─ httpErrors.js
│  │  └─ index.js
│  ├─ utils
│  │  ├─ adapters
│  │  │  ├─ ecpayAdapter.js
│  │  │  ├─ index.js
│  │  │  ├─ mailAdapter.js
│  │  │  └─ s3Adapter.js
│  │  └─ helpers
│  │     ├─ cookieHelper.js
│  │     ├─ index.js
│  │     ├─ securityHelper.js
│  │     └─ tokenHelper.js
│  └─ validators
│     ├─ requestValidator.js
│     ├─ schema
│     │  ├─ auth.js
│     │  └─ product.js
│     └─ validations.js
├─ config
│  ├─ database.js
│  ├─ redis.js
│  └─ socket.js
├─ controllers
│  ├─ authController.js
│  ├─ imageController.js
│  ├─ orderController.js
│  ├─ paymentController.js
│  ├─ productCommand.js
│  ├─ productController.js
│  ├─ productQuery.js
│  └─ systemMessageController.js
├─ events
│  ├─ eventBus.js
│  ├─ eventEmitter.js
│  ├─ index.js
│  ├─ publishers
│  │  ├─ emailEvents.js
│  │  ├─ index.js
│  │  ├─ registerEvents.js
│  │  └─ sessionEvents.js
│  └─ subscribers
│     ├─ index.js
│     ├─ mailEvent.js
│     ├─ notificationEvents.js
│     ├─ paymentEvents.js
│     ├─ registerEvents.js
│     ├─ sessionEvents.js
│     └─ trade
│        ├─ orderActivatedHandler.js
│        ├─ orderReceivedHandler.js
│        └─ orderShippedHandler.js
├─ middlewares
│  ├─ auth
│  │  ├─ requireAdminSession.js
│  │  └─ verifyUserToken.js
│  ├─ index.js
│  └─ multer
│     └─ multer.js
├─ models
│  ├─ baseOrderModel.js
│  ├─ chatMessageModel.js
│  ├─ counter.js
│  ├─ imageModel.js
│  ├─ paymentModel.js
│  ├─ productModel.js
│  ├─ productOrderModel.js
│  ├─ systemMessageModel.js
│  ├─ topupOrderModel.js
│  ├─ tradeMessageModal.js
│  ├─ tradeModel.js
│  ├─ transactionModel.js
│  └─ userModel.js
├─ package-lock.json
├─ package.json
├─ redis
│  └─ client.js
├─ repositories
│  ├─ authRepository.js
│  ├─ baseRepository.js
│  ├─ chatRoomRepository.js
│  ├─ imageRepository.js
│  ├─ index.js
│  ├─ orderRepository.js
│  ├─ paymentRepository.js
│  ├─ productRepository.js
│  ├─ systemMessageRepository.js
│  ├─ tradeMessageRepository.js
│  ├─ transactionRepository.js
│  └─ userRepository.js
├─ routes
│  ├─ authRoutes.js
│  ├─ imageRoutes.js
│  ├─ index.js
│  ├─ orderRoutes.js
│  ├─ paymentRoutes.js
│  ├─ productRoutes.js
│  ├─ publicRoutes.js
│  └─ systemMessageRoute.js
├─ server.js
├─ services
│  ├─ authService.js
│  ├─ chatRoomService.js
│  ├─ dependencies.js
│  ├─ imageService.js
│  ├─ orderService.js
│  ├─ paymentService.js
│  ├─ productService.js
│  ├─ registry.js
│  ├─ sessionService.js
│  ├─ socketService.js
│  ├─ systemMessageService.js
│  ├─ tradeRoomService.js
│  ├─ transactionService.js
│  └─ userService.js
└─ sockets
   ├─ events
   │  ├─ chatRoomEvents.js
   │  └─ tradeRoomEvents.js
   ├─ helpers
   │  └─ chatRoomHelper.js
   ├─ index.js
   └─ middleware
      └─ authMiddleware.js

```