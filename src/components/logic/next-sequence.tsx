export function NextSequence(props: { nextSequence: Date }) {
  return (
    <p className="text-2xl font-bold">
      Prochaine séquence programmée le {props.nextSequence.toLocaleDateString()}{" "}
      à {props.nextSequence.toLocaleTimeString()}
    </p>
  );
}
