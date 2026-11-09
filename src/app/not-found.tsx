import { ButtonLink, Container, Eyebrow } from '@/components/ui';

export default function NotFound() {
  return (
    <Container className="py-28">
      <Eyebrow>404</Eyebrow>
      <h1 className="mt-5 font-serif text-5xl tracking-tight text-ink">This page does not exist.</h1>
      <p className="mt-4 max-w-lg text-lg text-muted">The link may be out of date. The work and the contact details are a click away.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/">Home</ButtonLink>
        <ButtonLink href="/work" variant="secondary">Selected work</ButtonLink>
      </div>
    </Container>
  );
}
