const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { fromEnv } = require("@aws-sdk/credential-provider-env");
const { InternalServerError } = require("../errors/httpErrors");

// 設置 AWS SDK
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: fromEnv(),
});

const uploadImageToS3 = async ({ buffer, mimetype, key }) => {
  if (!buffer || !mimetype || !key) {
    throw new InternalServerError("uploadImageToS3 - 參數缺失");
  }

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: buffer, // 從 memoryStorage 取得 buffer
      ContentType: mimetype,
    })
  );
};

const deleteImageFromS3 = async ({ key }) => {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
    })
  );

  // 錯誤紀錄 + 背景排程定期刪除孤兒檔案 - 有時間研究
};

const generateImageUrl = (key) => {
  return `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

module.exports = { uploadImageToS3, deleteImageFromS3, generateImageUrl };
