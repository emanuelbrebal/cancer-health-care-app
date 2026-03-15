import { Prisma } from "@prisma/client";

type CommunityWithRelations = Prisma.CommunityGetPayload<{
    include: { owner: true, _count: { select: { topics: true } } }
}>;

type TopicWithRelations = Prisma.TopicGetPayload<{
    include: { author: true, _count: { select: { posts: true } } }
}>;

type PostWithRelations = Prisma.PostGetPayload<{
    include: { author: true, _count: { select: { comments: true } } }
}>;

type CommentWithRelations = Prisma.CommentGetPayload<{
    include: { author: true }
}>;

export class SocialMapper {
    static toCommunityDto(community: CommunityWithRelations) {
        if (!community) return null;
        return {
            id: community.id,
            name: community.name,
            description: community.description,
            imagePath: community.image_path,
            ownerName: community.owner.name,
            topicsCount: community._count.topics,
            createdAt: community.createdAt
        };
    }

    static toTopicDto(topic: TopicWithRelations) {
        if (!topic) return null;
        return {
            id: topic.id,
            title: topic.title,
            content: topic.content,
            imagePath: topic.image_path,
            author: {
                id: topic.author.id,
                name: topic.author.name
            },
            postsCount: topic._count.posts,
            createdAt: topic.createdAt
        };
    }

    static toPostDto(post: PostWithRelations) {
        if (!post) return null;
        return {
            id: post.id,
            content: post.content,
            imagePath: post.image_path,
            author: {
                id: post.author.id,
                name: post.author.name,
                avatar: post.author.profile_picture 
            },
            commentsCount: post._count.comments,
            createdAt: post.createdAt
        };
    }

    static toCommentDto(comment: CommentWithRelations) {
        if (!comment) return null;
        return {
            id: comment.id,
            content: comment.content,
            authorName: comment.author.name,
            createdAt: comment.createdAt
        };
    }
}