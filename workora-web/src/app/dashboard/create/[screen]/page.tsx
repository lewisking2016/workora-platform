import { redirect } from 'next/navigation';
import { SystemStateScreen } from '@/components/system/StatusScreens';
import { loadSystemStatus } from '@/lib/system-status';

export const dynamic = 'force-dynamic';

type CreateScreen =
  | 'hub'
  | 'post'
  | 'reel'
  | 'story'
  | 'gig'
  | 'proof'
  | 'upload-media'
  | 'camera-capture'
  | 'gallery-picker'
  | 'thumbnail-picker'
  | 'caption-composer'
  | 'tag-people'
  | 'tag-trade'
  | 'location-picker'
  | 'audience-picker'
  | 'drafts'
  | 'draft-detail'
  | 'publish-confirmation'
  | 'published-success'
  | 'upload-progress'
  | 'upload-failed'
  | 'upload-retry'
  | 'upload-cancel-confirmation'
  | 'file-type-error'
  | 'file-size-error'
  | 'permission-camera'
  | 'permission-storage';

const COPY: Record<CreateScreen, { title: string; description: string; primaryHref: string; primaryLabel: string; secondaryHref?: string; secondaryLabel?: string }> = {
  hub: { title: 'Create hub', description: 'Open the live creation hub for posts, reels, stories, gigs, and proof-of-work.', primaryHref: '/dashboard/create', primaryLabel: 'Open create hub' },
  post: { title: 'Create post screen', description: 'Publish a live post to the feed using backend-connected media and metadata.', primaryHref: '/dashboard/create/new?type=post', primaryLabel: 'Open post composer' },
  reel: { title: 'Create reel screen', description: 'Open the live reel composer with preview, draft, and publish states.', primaryHref: '/dashboard/create/new?type=reel', primaryLabel: 'Open reel composer' },
  story: { title: 'Create story screen', description: 'Open the live story creation flow for camera, gallery, and quick publish.', primaryHref: '/dashboard/create/new?type=story', primaryLabel: 'Open story composer' },
  gig: { title: 'Create gig screen', description: 'Create a live gig that powers feed, saved, analytics, and pro surfaces.', primaryHref: '/dashboard/create/new?type=gig', primaryLabel: 'Open gig composer' },
  proof: { title: 'Create proof-of-work screen', description: 'Upload proof-of-work media directly into the live portfolio pipeline.', primaryHref: '/dashboard/create/new?type=proof', primaryLabel: 'Open proof upload' },
  'upload-media': { title: 'Upload media picker', description: 'Choose live media from camera, gallery, or file picker.', primaryHref: '/dashboard/create/new?type=media', primaryLabel: 'Open media picker' },
  'camera-capture': { title: 'Camera capture screen', description: 'Capture live photos or video clips from the device camera.', primaryHref: '/dashboard/create/new?type=media', primaryLabel: 'Open camera' },
  'gallery-picker': { title: 'Gallery picker screen', description: 'Pick existing media from the device gallery and continue editing.', primaryHref: '/dashboard/create/new?type=media', primaryLabel: 'Open gallery' },
  'thumbnail-picker': { title: 'Thumbnail picker screen', description: 'Select the thumbnail that represents the live video post.', primaryHref: '/dashboard/create/new?type=media', primaryLabel: 'Choose thumbnail' },
  'caption-composer': { title: 'Caption composer', description: 'Compose live post copy, mentions, tags, and descriptions.', primaryHref: '/dashboard/create/new?type=post', primaryLabel: 'Open caption composer' },
  'tag-people': { title: 'Tag people screen', description: 'Tag people in the live creation flow so they can be notified.', primaryHref: '/dashboard/create/new?type=post', primaryLabel: 'Tag people' },
  'tag-trade': { title: 'Tag trade screen', description: 'Assign a trade to keep the backend discovery surfaces aligned.', primaryHref: '/dashboard/create/new?type=post', primaryLabel: 'Tag trade' },
  'location-picker': { title: 'Location picker screen', description: 'Attach a live location to improve nearby discovery and trust ranking.', primaryHref: '/dashboard/create/new?type=post', primaryLabel: 'Pick location' },
  'audience-picker': { title: 'Audience picker screen', description: 'Choose the audience visibility for the live post or draft.', primaryHref: '/dashboard/create/new?type=post', primaryLabel: 'Pick audience' },
  drafts: { title: 'Drafts screen', description: 'Open saved drafts from the live backend before publishing.', primaryHref: '/dashboard/create/drafts', primaryLabel: 'Open drafts' },
  'draft-detail': { title: 'Draft detail screen', description: 'Review a draft before publishing it to the live feed.', primaryHref: '/dashboard/create/drafts', primaryLabel: 'Open draft detail' },
  'publish-confirmation': { title: 'Publish confirmation screen', description: 'Confirm the live media and metadata before it is sent to the feed.', primaryHref: '/dashboard/create/new?type=post', primaryLabel: 'Confirm publish' },
  'published-success': { title: 'Post published success screen', description: 'The live post was published successfully and is now visible in the feed.', primaryHref: '/dashboard/feed', primaryLabel: 'Open feed' },
  'upload-progress': { title: 'Upload progress screen', description: 'Track the live upload while the backend stores media and creates the post.', primaryHref: '/dashboard/create/new?type=post', primaryLabel: 'See upload flow' },
  'upload-failed': { title: 'Upload failed screen', description: 'The live upload failed and can be retried from the creation flow.', primaryHref: '/dashboard/create/new?type=post', primaryLabel: 'Retry upload' },
  'upload-retry': { title: 'Upload retry screen', description: 'Retry the live upload without losing the selected media or caption.', primaryHref: '/dashboard/create/new?type=post', primaryLabel: 'Retry now' },
  'upload-cancel-confirmation': { title: 'Upload cancel confirmation', description: 'Confirm whether you want to cancel the live upload and keep the draft.', primaryHref: '/dashboard/create/new?type=post', primaryLabel: 'Return to draft' },
  'file-type-error': { title: 'File type error screen', description: 'The selected file type is not supported by the live upload pipeline.', primaryHref: '/dashboard/create/new?type=media', primaryLabel: 'Pick another file' },
  'file-size-error': { title: 'File size error screen', description: 'The selected file exceeds the live upload size limit.', primaryHref: '/dashboard/create/new?type=media', primaryLabel: 'Pick a smaller file' },
  'permission-camera': { title: 'Permission denied camera screen', description: 'Camera access is required to capture live stories, reels, and work previews.', primaryHref: '/dashboard/create/new?type=media', primaryLabel: 'Open camera flow' },
  'permission-storage': { title: 'Permission denied storage screen', description: 'Storage access is required to read media from the device gallery.', primaryHref: '/dashboard/create/new?type=media', primaryLabel: 'Open gallery flow' },
};

export default async function CreateScreenPage({
  params,
}: {
  params: Promise<{ screen: string }>;
}) {
  const [{ screen }, status] = await Promise.all([params, loadSystemStatus()]);
  const key = screen as CreateScreen;
  const copy = COPY[key];

  if (!copy) {
    redirect('/dashboard/create');
  }

  return (
    <SystemStateScreen
      title={copy.title}
      description={copy.description}
      primaryHref={copy.primaryHref}
      primaryLabel={copy.primaryLabel}
      secondaryHref={copy.secondaryHref || '/dashboard/create'}
      secondaryLabel={copy.secondaryLabel || 'Back to create hub'}
      status={status}
      variant="generic"
    />
  );
}
