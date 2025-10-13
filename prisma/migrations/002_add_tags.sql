-- Add tags table
CREATE TABLE [dbo].[Tag] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [slug] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Tag_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Tag_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Tag_slug_key] UNIQUE NONCLUSTERED ([slug])
);

-- Add thread_tags junction table
CREATE TABLE [dbo].[ThreadTag] (
    [threadId] NVARCHAR(1000) NOT NULL,
    [tagId] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [ThreadTag_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ThreadTag_pkey] PRIMARY KEY CLUSTERED ([threadId],[tagId]),
    CONSTRAINT [ThreadTag_threadId_fkey] FOREIGN KEY ([threadId]) REFERENCES [dbo].[Thread]([id]) ON DELETE CASCADE,
    CONSTRAINT [ThreadTag_tagId_fkey] FOREIGN KEY ([tagId]) REFERENCES [dbo].[Tag]([id]) ON DELETE CASCADE
);

-- Create index on tags for faster lookup
CREATE INDEX [Tag_name_idx] ON [dbo].[Tag]([name]);