
```
server
├─ config
│  ├─ database.js
│  ├─ redis.js
│  └─ socket.js
├─ controllers
│  ├─ authController.js
│  ├─ imageController.js
│  ├─ orderController.js
│  ├─ paymentController.js
│  ├─ productController.js
│  └─ systemMessageController.js
├─ errors
│  ├─ httpErrors.js
│  └─ index.js
├─ eventBus
│  ├─ eventBus.js
│  ├─ eventEmitter.js
│  └─ handlers
│     ├─ notifyHandler.js
│     ├─ orderActivatedHandler.js
│     ├─ orderReceivedHandler.js
│     ├─ orderShippedHandler.js
│     ├─ paymentHandler.js
│     └─ redisHandler.js
├─ helpers
│  ├─ cookieHelper.js
│  ├─ ecpayHelper.js
│  ├─ mailHelper.js
│  ├─ redisEventHelper.js
│  ├─ s3Helper.js
│  ├─ securityHelper.js
│  └─ tokenHelper.js
├─ middlewares
│  ├─ authMiddleware
│  │  ├─ jwtStrategy.js
│  │  └─ passport.js
│  ├─ index.js
│  ├─ multer
│  │  └─ multer.js
│  └─ validators
│     ├─ requestValidator.js
│     ├─ schema
│     │  ├─ auth.js
│     │  └─ product.js
│     └─ validations.js
├─ models
│  ├─ chatMessageModel.js
│  ├─ imageModel.js
│  ├─ orderModel.js
│  ├─ paymentModel.js
│  ├─ productModel.js
│  ├─ systemMessageModel.js
│  ├─ tradeMessageModal.js
│  ├─ transactionModel.js
│  └─ userModel.js
├─ package-lock.json
├─ package.json
├─ readme
├─ redis
├─ repository
│  ├─ authRepository.js
│  ├─ baseRepository
│  │  ├─ BaseRepository.js
│  │  └─ README
│  ├─ chatRoomRepository.js
│  ├─ imageRepository.js
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
│  └─ systemMessageRoute.js
├─ server.js
├─ services
│  ├─ authService.js
│  ├─ chatRoomService.js
│  ├─ imageService.js
│  ├─ orderService.js
│  ├─ paymentService.js
│  ├─ productService.js
│  ├─ socketService.js
│  ├─ systemMessageService.js
│  ├─ tradeRoomService.js
│  ├─ transactionService.js
│  └─ userService.js
└─ sockets
   ├─ handlers
   │  ├─ chatRoomHandlers.js
   │  └─ tradeRoomHandlers.js
   ├─ helpers
   │  └─ chatRoomHelper.js
   ├─ middleware
   │  └─ authMiddleware.js
   └─ socketEvents.js

```
```
server
├─ config
│  ├─ database.js
│  ├─ redis.js
│  └─ socket.js
├─ controllers
│  ├─ authController.js
│  ├─ imageController.js
│  ├─ orderController.js
│  ├─ paymentController.js
│  ├─ productController.js
│  └─ systemMessageController.js
├─ errors
│  ├─ httpErrors.js
│  └─ index.js
├─ eventBus
│  ├─ emitters
│  │  ├─ emailEvents.js
│  │  └─ sessionEvents.js
│  ├─ eventEmitter.js
│  ├─ handlers
│  │  ├─ mailHandler.js
│  │  ├─ notifyHandler.js
│  │  ├─ orderActivatedHandler.js
│  │  ├─ orderReceivedHandler.js
│  │  ├─ orderShippedHandler.js
│  │  ├─ paymentHandler.js
│  │  └─ sessionHandler.js
│  └─ index.js
├─ FolderStructure.md
├─ helpers
│  ├─ cookieHelper.js
│  ├─ ecpayHelper.js
│  ├─ generateId.js
│  ├─ mailHelper.js
│  ├─ s3Helper.js
│  ├─ securityHelper.js
│  └─ tokenHelper.js
├─ middlewares
│  ├─ auth
│  │  ├─ jwtStrategy.js
│  │  └─ passport.js
│  ├─ index.js
│  ├─ multer
│  │  └─ multer.js
│  └─ validators
│     ├─ requestValidator.js
│     ├─ schema
│     │  ├─ auth.js
│     │  └─ product.js
│     └─ validations.js
├─ models
│  ├─ chatMessageModel.js
│  ├─ counter.js
│  ├─ imageModel.js
│  ├─ orderModel.js
│  ├─ paymentModel.js
│  ├─ productModel.js
│  ├─ systemMessageModel.js
│  ├─ tradeMessageModal.js
│  ├─ transactionModel.js
│  └─ userModel.js
├─ package-lock.json
├─ package.json
├─ readme
├─ README.md
├─ repository
│  ├─ authRepository.js
│  ├─ baseRepository
│  │  ├─ BaseRepository.js
│  │  └─ README
│  ├─ chatRoomRepository.js
│  ├─ imageRepository.js
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
│  └─ systemMessageRoute.js
├─ server.js
├─ services
│  ├─ authService.js
│  ├─ chatRoomService.js
│  ├─ imageService.js
│  ├─ orderService.js
│  ├─ paymentService.js
│  ├─ productService.js
│  ├─ socketService.js
│  ├─ systemMessageService.js
│  ├─ tradeRoomService.js
│  ├─ transactionService.js
│  └─ userService.js
└─ sockets
   ├─ handlers
   │  ├─ chatRoomHandlers.js
   │  └─ tradeRoomHandlers.js
   ├─ helpers
   │  └─ chatRoomHelper.js
   ├─ index.js
   └─ middleware
      └─ authMiddleware.js

```