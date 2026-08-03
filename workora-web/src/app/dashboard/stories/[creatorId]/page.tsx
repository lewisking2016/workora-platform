import ShortVideoViewer from '@/components/short-video/ShortVideoViewer';

export default async function StoryViewerPage({
  params,
}: {
  params: { creatorId: string };
}) {
  const { creatorId } = params;
  return <ShortVideoViewer mode="story" creatorId={creatorId} />;
}
