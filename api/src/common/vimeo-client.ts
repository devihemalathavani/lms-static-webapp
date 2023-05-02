export const parseVimeoVideoLink = (link: string) => {
  // Extract the video id from the link with a regex
  const regex = /\d+/gi;
  const videoId = link.match(regex)?.[0];
  if (!videoId) {
    return link;
  }

  // Return the embed link
  return `https://player.vimeo.com/video/${videoId}`;
};
