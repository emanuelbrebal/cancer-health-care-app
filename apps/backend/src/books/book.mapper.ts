export class BookMapper {
  static toDto(media: any) {
    return {
      id: media.id,
      title: media.title,
      type: media.type,
      author: media.bookDetail?.author,
      isOpenSource: media.bookDetail?.isOpenSource,
      eduCapesLink: media.bookDetail?.eduCapesLink,
      visitCount: media.bookDetail?.visitCount,
    };
  }
}