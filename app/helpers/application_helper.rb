# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper

  def javascript(*sources)
    if block_given?
      content_for(:javascript) do
        '<script type="text/javascript" charset="utf-8">' +
        '//<![CDATA[
' +
          yield +
        '
        //]]>' +
        '</script>'
      end
    else
      content_for(:head) { javascript_include_tag(*sources) }
    end
  end

end
