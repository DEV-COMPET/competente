export type directory = {
  content: string,
  template: string,
  palestrante_content: string
}
export const talksDirectories: directory = 
  {
    content: "talks/talks_content.txt",
    template: "talks/talks_template.png",
    palestrante_content: "talks/talks_palestrante_content.txt",
  }
export const competDirectories: directory = 
  {
    content: "compet/compet_content.txt",
    template: "compet/compet_template.png",
    palestrante_content: "",
  }
