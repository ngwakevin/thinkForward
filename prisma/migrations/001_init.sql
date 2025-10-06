BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] NVARCHAR(1000) NOT NULL,
    [provider] NVARCHAR(1000) NOT NULL,
    [providerAccountId] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000),
    [name] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_providerAccountId_key] UNIQUE NONCLUSTERED ([providerAccountId]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Profile] (
    [userId] NVARCHAR(1000) NOT NULL,
    [displayName] NVARCHAR(1000),
    [avatarUrl] NVARCHAR(1000),
    [bio] NVARCHAR(1000),
    [addressLine1] NVARCHAR(1000),
    [addressLine2] NVARCHAR(1000),
    [city] NVARCHAR(1000),
    [state] NVARCHAR(1000),
    [postalCode] NVARCHAR(1000),
    [country] NVARCHAR(1000),
    [latitude] DECIMAL(38,18),
    [longitude] DECIMAL(38,18),
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Profile_pkey] PRIMARY KEY CLUSTERED ([userId])
);

-- CreateTable
CREATE TABLE [dbo].[Activity] (
    [id] NVARCHAR(1000) NOT NULL,
    [slug] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [isActive] BIT NOT NULL CONSTRAINT [Activity_isActive_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Activity_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Activity_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Activity_slug_key] UNIQUE NONCLUSTERED ([slug])
);

-- CreateTable
CREATE TABLE [dbo].[UserActivity] (
    [userId] NVARCHAR(1000) NOT NULL,
    [activityId] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [UserActivity_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [UserActivity_pkey] PRIMARY KEY CLUSTERED ([userId],[activityId])
);

-- AddForeignKey
ALTER TABLE [dbo].[Profile] ADD CONSTRAINT [Profile_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[UserActivity] ADD CONSTRAINT [UserActivity_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[UserActivity] ADD CONSTRAINT [UserActivity_activityId_fkey] FOREIGN KEY ([activityId]) REFERENCES [dbo].[Activity]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

