import ShortVideoViewer from '@/components/short-video/ShortVideoViewer';

export default async function StoryViewerPage({
  params,
}: {
  params: Promise<{ creatorId: string }>;
}) {
  const { creatorId } = await params;
  return <ShortVideoViewer mode="story" creatorId={creatorId} />;
}
