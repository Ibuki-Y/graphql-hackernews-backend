function links(parent, args, context) {
  return context.prisma.user
    .findUnique({
      // parent.id: Userのid
      where: { id: parent.id },
    })
    .links();
}

module.exports = {
  links,
};
